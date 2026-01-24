/**
 * Sensor Initializer
 *
 * Handles initialization of sensors from datasheets.
 */

import { getInterface, getSensor } from '../datasheets.js';
import { SensorSetupError } from '../errors.js';
import type { Measurement, SensorChannel } from '../types/index.js';

/**
 * State shared with the initializer for setting up sensors
 */
export interface InitializerState {
  deviceChannels: SensorChannel[];
  deviceMeasurements: Map<number, Map<number, Measurement>>;
  sensorNames: Map<string, SensorChannel>;
  measurementSensorIds: Map<string, number>;
  dataResults: Map<string, number | null>;
  dataAckCounter: Map<number, number>;
  dataStack: Map<number, number[]>;
  sensorData: Map<number, Map<number, number | null>>;
}

/**
 * Initializes sensors from PASCO datasheets and builds lookup tables
 */
export class SensorInitializer {
  readonly state: InitializerState;

  constructor(state: InitializerState) {
    this.state = state;
  }

  /**
   * Initialize device channels from interface definition
   */
  initializeFromInterface(interfaceId: number): void {
    const iface = getInterface(interfaceId);
    if (!iface) {
      throw new SensorSetupError(`Interface ${interfaceId} not found`);
    }

    this.state.deviceChannels = iface.channels.map((c) => ({
      id: c.ID,
      name: c.NameTag ?? '',
      sensor_id: c.SensorID ?? 0,
      type: c.Type ?? 'Pasport',
      output_type: c.OutputType ?? '',
      measurements: [],
      total_data_size: 0,
      plug_detect: c.PlugDetect ?? 0,
      channel_id_tag: c.ChannelIDTag ?? '',
      factory_cal_ids: [],
    }));
  }

  /**
   * Check if any channels support pluggable sensors
   */
  hasPluggableSensors(): boolean {
    return this.state.deviceChannels.some((ch) => ch.plug_detect === 1);
  }

  /**
   * Initialize all sensors, optionally with plugin sensor IDs
   */
  initializeSensors(pluginSensorIds?: number[]): void {
    try {
      // Update sensor IDs for plugin sensors
      if (pluginSensorIds) {
        let i = 0;
        for (const channel of this.state.deviceChannels) {
          if (channel.plug_detect === 1) {
            channel.sensor_id = pluginSensorIds[i] ?? 0;
            i++;
          }
        }
      }

      // Initialize each sensor channel
      for (const channel of this.state.deviceChannels) {
        if (channel.type === 'Pasport' && channel.sensor_id !== 0) {
          this._initializeSensor(channel);
        }
      }

      // Build lookup tables
      this._buildLookupTables();
    } catch (e) {
      if (e instanceof SensorSetupError) {
        throw e;
      }
      const error = e instanceof Error ? e : new Error(String(e));
      throw new SensorSetupError('Failed to initialize sensors', { cause: error });
    }
  }

  /**
   * Initialize a single sensor channel
   */
  private _initializeSensor(channel: SensorChannel): void {
    // Initialize channel state
    this.state.dataAckCounter.set(channel.id, 0);
    this.state.dataStack.set(channel.id, []);
    this.state.deviceMeasurements.set(channel.id, new Map());

    const sensorData = getSensor(channel.sensor_id);
    if (!sensorData) return;

    channel.name = sensorData.tag;

    const measurements: string[] = [];
    const factoryCalIds: string[] = [];

    for (const [mId, m] of sensorData.measurements) {
      // Store measurement definition
      this.state.deviceMeasurements.get(channel.id)?.set(mId, { ...m });

      // Add to visible measurements list
      if (!m.Internal && m.Type !== 'Derivative' && m.Visible) {
        measurements.push(m.NameTag);
      }

      // Track factory calibration IDs
      if (m.Type === 'FactoryCal') {
        factoryCalIds.push(m.ID.toString());
      }

      // Accumulate total data size
      if (m.DataSize) {
        channel.total_data_size += m.DataSize;
      }
    }

    channel.measurements = measurements;
    channel.factory_cal_ids = factoryCalIds;

    // Initialize sensor data values
    const sensorDataMap = new Map<number, number | null>();
    for (const [mId, m] of sensorData.measurements) {
      sensorDataMap.set(mId, m.Type === 'RotaryPos' ? 0 : null);
    }
    this.state.sensorData.set(channel.id, sensorDataMap);
  }

  /**
   * Build lookup tables for quick access to measurements
   */
  private _buildLookupTables(): void {
    this.state.measurementSensorIds.clear();
    this.state.dataResults.clear();

    for (const channel of this.state.deviceChannels) {
      for (const measurement of channel.measurements) {
        this.state.measurementSensorIds.set(measurement, channel.id);
        this.state.dataResults.set(measurement, null);
      }
    }

    this.state.sensorNames.clear();
    for (const sensor of this.state.deviceChannels) {
      this.state.sensorNames.set(sensor.name, sensor);
    }
  }
}
