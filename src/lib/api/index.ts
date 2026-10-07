import { httpClient } from '../http/httpClient';
import { authClient } from './authClient';
import { projectsClient } from './projectsClient';
import { blogsClient } from './blogsClient';
import { learningClient } from './learningClient';
import { certificatesClient } from './certificatesClient';
import { journeyClient } from './journeyClient';
import { academicsClient } from './academicsClient';
import { freelancingClient } from './freelancingClient';
import { mediaClient } from './mediaClient';
import { settingsClient } from './settingsClient';
import { searchClient } from './searchClient';
import { contactClient } from './contactClient';
import { dashboardClient } from './dashboardClient';

export class ApiClient {
  public readonly http = httpClient;
  public readonly auth = authClient;
  public readonly projects = projectsClient;
  public readonly blogs = blogsClient;
  public readonly learning = learningClient;
  public readonly certificates = certificatesClient;
  public readonly journey = journeyClient;
  public readonly academics = academicsClient;
  public readonly freelancing = freelancingClient;
  public readonly media = mediaClient;
  public readonly settings = settingsClient;
  public readonly search = searchClient;
  public readonly contact = contactClient;
  public readonly dashboard = dashboardClient;
}

export const apiClient = new ApiClient();

export {
  authClient,
  projectsClient,
  blogsClient,
  learningClient,
  certificatesClient,
  journeyClient,
  academicsClient,
  freelancingClient,
  mediaClient,
  settingsClient,
  searchClient,
  contactClient,
  dashboardClient,
};
