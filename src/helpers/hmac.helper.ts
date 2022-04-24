import * as crypto from 'crypto';

export abstract class HMACHelper {
  public static hashHmac256(secret: string, data: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    return hmac.update(data).digest('hex');
  }

  public static generateSign(
    secret: string,
    deviceId: string,
    exp: number,
  ): string {
    return HMACHelper.hashHmac256(secret, `${deviceId}${exp}`);
  }
}
