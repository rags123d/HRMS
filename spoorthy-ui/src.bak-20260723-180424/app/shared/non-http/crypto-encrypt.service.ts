import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoEncryptService {
  private key = CryptoJS.enc.Utf8.parse(environment.SecretKey);
  private iv = CryptoJS.enc.Utf8.parse(environment.SecretKey);
  
  constructor() { }
  
  cryptoDecrypt(encryptedStr: string) { 
    var decryptedStr = CryptoJS.AES.decrypt(encryptedStr.trim(), this.key, {
      keySize: 128,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8); 
    return decryptedStr;
  }
  cryptoEncrypt(plainTxt: string) { 
    var encryptedStr = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainTxt), this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(); 
    return encryptedStr;
  }
}
