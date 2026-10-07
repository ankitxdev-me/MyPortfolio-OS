import { BaseClient } from './baseClient';
import type { CertificateDTO } from '../types/api.types';

export class CertificatesClient extends BaseClient<CertificateDTO> {
  constructor() {
    super('/certificates');
  }
}

export const certificatesClient = new CertificatesClient();
