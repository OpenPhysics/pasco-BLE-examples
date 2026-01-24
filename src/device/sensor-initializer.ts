/**
 * Sensor Initializer
 *
 * Handles initialization of PASCO sensors from datasheets.
 *
 * The initialization process follows these steps:
 * 1. Load wireless interface definition (channels and capabilities)
 * 2. Detect pluggable sensors (if interface supports plug detection)
 * 3. Initialize each sensor channel with measurements and calibrations
 * 4. Build lookup tables for fast measurement access during data collection
 *
 * Some PASCO devices have fixed sensors, while others support hot-pluggable
 * sensors that are detected at runtime.
 */

import { getInterface, getSensor } from '../datasheets.js';
import { SensorSetupError } from '../errors.js';
import type { Measurement, SensorChannel } from '../types/index.js';

/**
 * State shared with the initializer for setting up sensors
 *
 * This state object is populated during initialization and used throughout
 * the device lifecycle for sensor management and data collection.
 */
export interface InitializerState {
  /** Array of sensor channels on the device (from wireless interface definition) */
  deviceChannels: SensorChannel[];

  /** Map of channel ID -> measurement ID -> measurement definition */
  deviceMeasurements: Map<number, Map<number, Measurement>>;

  /** Map of sensor name -> sensor channel (for lookups by name) */
  sensorNames: Map<string, SensorChannel>;

  /** Map of measurement name -> channel ID (for finding which sensor provides a measurement) */
  measurementSensorIds: Map<string, number>;

  /** Map of measurement name -> latest value (updated during data collection) */
  dataResults: Map<string, number | null>;

  /** Map of channel ID -> acknowledgement counter (for BLE protocol) */
  dataAckCounter: Map<number, number>;

  /** Map of channel ID -> data buffer stack (for accumulating multi-packet data) */
  dataStack: Map<number, number[]>;

  /** Map of channel ID -> (measurement ID -> raw value) (latest sensor readings) */
  sensorData: Map<number, Map<number, number | null>>;
}

/**
 * Initializes sensors from PASCO datasheets and builds lookup tables
 *
 * This class is responsible for:
 * - Loading wireless interface definitions from datasheets
 * - Initializing sensor channels with their measurements
 * - Building efficient lookup tables for data collection
 * - Managing state for both fixed and pluggable sensors
 */
export class SensorInitializer {
  readonly state: InitializerState;

  constructor(state: InitializerState) {
    this.state = state;
  }

  /**
   * Initialize device channels from wireless interface definition
   *
   * Loads the interface specification from datasheets and creates
   * channel objects for each sensor port on the device.
   *
   * @param interfaceId - The wireless interface ID from PASCO datasheets
   * @throws {SensorSetupError} If the interface ID is not found
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
   *
   * Some PASCO devices have ports that support hot-pluggable sensors
   * (e.g., wireless sensor ports). This method checks if the device
   * interface definition includes any such ports.
   *
   * @returns true if at least one channel supports plug detection
   */
  hasPluggableSensors(): boolean {
    return this.state.deviceChannels.some((ch) => ch.plug_detect === 1);
  }

  /**
   * Initialize all sensors, optionally with pluggable sensor IDs
   *
   * This is the main initialization method that:
   * 1. Updates sensor IDs for pluggable sensors (if provided)
   * 2. Initializes each PASPORT sensor channel
   * 3. Builds lookup tables for efficient measurement access
   *
   * @param pluginSensorIds - Optional array of sensor IDs detected on pluggable ports
   * @throws {SensorSetupError} If sensor initialization fails
   *
   * @example
   * // Fixed sensors (no pluggable sensors)
   * initializer.initializeSensors();
   *
   * // With detected pluggable sensors
   * const detectedIds = [65, 66]; // Temperature and Pressure sensor IDs
   * initializer.initializeSensors(detectedIds);
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
   *
   * This method:
   * 1. Initializes BLE protocol state (ack counters, data buffers)
   * 2. Loads sensor definition from datasheets
   * 3. Filters measurements by visibility (excludes internal/derivative measurements)
   * 4. Extracts factory calibration IDs
   * 5. Calculates total data size for BLE packet sizing
   * 6. Initializes data storage maps
   *
   * @param channel - The sensor channel to initialize
   * @private
   */
  private _initializeSensor(channel: SensorChannel): void {
    // Initialize BLE protocol state for this channel
    this.state.dataAckCounter.set(channel.id, 0);
    this.state.dataStack.set(channel.id, []);
    this.state.deviceMeasurements.set(channel.id, new Map());

    // Load sensor definition from datasheets
    const sensorData = getSensor(channel.sensor_id);
    if (!sensorData) return;

    channel.name = sensorData.tag;

    const measurements: string[] = [];
    const factoryCalIds: string[] = [];

    // Process all measurements defined in the sensor datasheet
    for (const [mId, m] of sensorData.measurements) {
      // Store full measurement definition for data decoding
      this.state.deviceMeasurements.get(channel.id)?.set(mId, { ...m });

      // Build list of user-visible measurements
      // Filters out:
      // - Internal measurements (used for calculations but not exposed)
      // - Derivative measurements (computed from other measurements)
      // - Hidden measurements (marked as not visible)
      if (!m.Internal && m.Type !== 'Derivative' && m.Visible) {
        measurements.push(m.NameTag);
      }

      // Track factory calibration IDs for calibration management
      if (m.Type === 'FactoryCal') {
        factoryCalIds.push(m.ID.toString());
      }

      // Accumulate total data size for BLE packet processing
      // Used to validate incoming data packets
      if (m.DataSize) {
        channel.total_data_size += m.DataSize;
      }
    }

    channel.measurements = measurements;
    channel.factory_cal_ids = factoryCalIds;

    // Initialize sensor data storage
    // RotaryPos sensors start at 0, others start as null (no data yet)
    const sensorDataMap = new Map<number, number | null>();
    for (const [mId, m] of sensorData.measurements) {
      sensorDataMap.set(mId, m.Type === 'RotaryPos' ? 0 : null);
    }
    this.state.sensorData.set(channel.id, sensorDataMap);
  }

  /**
   * Build lookup tables for quick access to measurements
   *
   * Creates efficient index structures for:
   * 1. Finding which channel provides a given measurement (by name)
   * 2. Looking up sensor channels by sensor name
   * 3. Initializing data result storage for all measurements
   *
   * These lookup tables enable O(1) access during high-frequency data
   * collection instead of linear searches through all channels.
   *
   * @private
   */
  private _buildLookupTables(): void {
    // Clear existing lookups
    this.state.measurementSensorIds.clear();
    this.state.dataResults.clear();

    // Build measurement name -> channel ID map
    // Allows quick lookup of which sensor provides a measurement
    for (const channel of this.state.deviceChannels) {
      for (const measurement of channel.measurements) {
        this.state.measurementSensorIds.set(measurement, channel.id);
        this.state.dataResults.set(measurement, null);
      }
    }

    // Build sensor name -> channel map
    // Allows quick lookup of channels by sensor name
    this.state.sensorNames.clear();
    for (const sensor of this.state.deviceChannels) {
      this.state.sensorNames.set(sensor.name, sensor);
    }
  }
}
