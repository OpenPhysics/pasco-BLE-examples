/**
 * Code.Node Device
 *
 * Extends PASCOBLEDevice with LED matrix and sound control capabilities
 * specific to the PASCO //code.Node device.
 */

import {
  type CharacterMatrix,
  getIcon,
  getWord,
  Icons,
  type LEDCoordinate,
} from './character-library.js';
import { PASCOBLEDevice } from './device/index.js';
import { DeviceNotConnected, InvalidParameter } from './errors.js';
import { limit } from './utils/math.js';

/**
 * CodeNode Device class
 *
 * Provides LED matrix display and speaker control for the //code.Node.
 */
export class CodeNodeDevice extends PASCOBLEDevice {
  protected static readonly GCMD_CODENODE_CMD = 0x37;
  protected static readonly CODENODE_CMD_SET_LED = 0x02;
  protected static readonly CODENODE_CMD_SET_LEDS = 0x03;
  protected static readonly CODENODE_CMD_SET_SOUND_FREQ = 0x04;

  /**
   * Set an individual LED on the 5x5 matrix
   * @param x Column value [0-4] (left to right)
   * @param y Row value [0-4] (top to bottom)
   * @param intensity Brightness control [0-255], default 128
   */
  async setLedInArray(x: number, y: number, intensity: number = 128): Promise<void> {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      throw new InvalidParameter('x and y must be integers');
    }

    if (x < 0 || x > 4 || y < 0 || y > 4) {
      throw new InvalidParameter('x and y must be in range [0-4]');
    }

    if (typeof intensity !== 'number') {
      throw new InvalidParameter('intensity must be a number');
    }

    // Converts xy position to LED index
    const ledIndex = 20 - y * 5 + x;
    const ledIntensity = Math.round(limit(intensity, 0, 255));

    const cmd = [
      CodeNodeDevice.GCMD_CODENODE_CMD,
      CodeNodeDevice.CODENODE_CMD_SET_LED,
      ledIndex,
      ledIntensity,
    ];

    await this.writeAwaitCallback(PASCOBLEDevice.SENSOR_SERVICE_ID, cmd);
  }

  /**
   * Set multiple LEDs on the 5x5 Matrix
   * @param xyList Array of [x, y] coordinate pairs
   *
   * LED Matrix Layout:
   * ```
   * | 0,0  1,0  2,0  3,0  4,0 |
   * | 0,1  1,1  2,1  3,1  4,1 |
   * | 0,2  1,2  2,2  3,2  4,2 |
   * | 0,3  1,3  2,3  3,3  4,3 |
   * | 0,4  1,4  2,4  3,4  4,4 |
   * ```
   *
   * @param intensity Brightness control [0-255], default 128
   */
  async setLedsInArray(xyList: LEDCoordinate[] = [], intensity: number = 128): Promise<void> {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    if (typeof intensity !== 'number') {
      throw new InvalidParameter('intensity must be a number');
    }

    let ledActivate = 0;

    for (const [x, y] of xyList) {
      if (!Number.isInteger(x) || !Number.isInteger(y)) {
        throw new InvalidParameter('x and y must be integers');
      }

      if (x < 0 || x > 4 || y < 0 || y > 4) {
        throw new InvalidParameter('x and y must be in range [0-4]');
      }

      // Converts xy position to LED index
      const ledIndex = 20 - y * 5 + x;
      ledActivate += 2 ** ledIndex;
    }

    const ledIntensity = Math.round(limit(intensity, 0, 255));

    const cmd = [
      CodeNodeDevice.GCMD_CODENODE_CMD,
      CodeNodeDevice.CODENODE_CMD_SET_LEDS,
      ledActivate & 0xff,
      (ledActivate >> 8) & 0xff,
      (ledActivate >> 16) & 0xff,
      (ledActivate >> 24) & 0xff,
      ledIntensity,
    ];

    await this.writeAwaitCallback(PASCOBLEDevice.SENSOR_SERVICE_ID, cmd);
  }

  /**
   * Set the //code.Node's RGB LED
   * @param red Brightness control of Red LED [0-255]
   * @param green Brightness control of Green LED [0-255]
   * @param blue Brightness control of Blue LED [0-255]
   */
  async setRgbLed(red: number, green: number, blue: number): Promise<void> {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    if (typeof red !== 'number' || typeof green !== 'number' || typeof blue !== 'number') {
      throw new InvalidParameter('red, green, and blue must be numbers');
    }

    const ledR = Math.round(limit(red, 0, 255));
    const ledG = Math.round(limit(green, 0, 255));
    const ledB = Math.round(limit(blue, 0, 255));

    const cmd = [
      CodeNodeDevice.GCMD_CODENODE_CMD,
      CodeNodeDevice.CODENODE_CMD_SET_LEDS,
      ledR,
      ledG,
      ledB,
      0x80,
      0x00,
    ];

    await this.writeAwaitCallback(PASCOBLEDevice.SENSOR_SERVICE_ID, cmd);
  }

  /**
   * Control the code node's built-in speaker output frequency
   * @param frequency Frequency in Hertz [0-20000]
   */
  async setSoundFrequency(frequency: number): Promise<void> {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    if (typeof frequency !== 'number') {
      throw new InvalidParameter('frequency must be a number');
    }

    const freq = Math.round(limit(frequency, 0, 20000));

    const cmd = [
      CodeNodeDevice.GCMD_CODENODE_CMD,
      CodeNodeDevice.CODENODE_CMD_SET_SOUND_FREQ,
      freq & 0xff,
      (freq >> 8) & 0xff,
    ];

    await this.writeAwaitCallback(PASCOBLEDevice.SENSOR_SERVICE_ID, cmd);
  }

  /**
   * Scroll text/numbers on the 5x5 LED Array
   * @param text Text to scroll (string, number, or integer)
   * @param delayMs Delay between frames in milliseconds (default: 100)
   */
  async scrollTextInArray(text: string | number, delayMs: number = 100): Promise<void> {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    const textStr = String(text).toUpperCase();
    const matrix = getWord(textStr);

    for (const frame of matrix) {
      await this.setLedsInArray(frame, 128);
      await this._delay(delayMs);
    }
  }

  /**
   * Show an image from the preassembled library on the 5x5 LED Array
   *
   * @example
   * ```typescript
   * import { Icons } from './character-library';
   * await device.showImageInArray(Icons.smile);
   * ```
   *
   * @param iconImage Icon from the character library (e.g., Icons.smile)
   */
  async showImageInArray(iconImage: CharacterMatrix): Promise<void> {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    if (!iconImage || typeof iconImage !== 'object') {
      throw new InvalidParameter('iconImage must be a valid icon object');
    }

    let matrix: LEDCoordinate[];
    try {
      matrix = getIcon(iconImage);
    } catch {
      throw new InvalidParameter('Invalid icon format');
    }

    await this.setLedsInArray(matrix, 128);
  }

  /**
   * Reset the speaker and LEDs on the code node
   */
  async reset(): Promise<void> {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    await this.setRgbLed(0, 0, 0);
    await this.setLedsInArray([], 0);
    await this.setSoundFrequency(0);
  }

  /**
   * Helper function to create a delay
   */
  protected _delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Re-export Icons for convenience
export { Icons };
