export interface ScheduleResponse {
  success: boolean;
  schedules: ScheduleEvent[];
}

export interface ScheduleEvent {
  id: string;
  title: string;
  duration: number;
  timezone: string;
  media: {
    type: string;
    playlistId?: string;
  };
  entity: string;
  doRecord: boolean;
  exceptions: null;
  isRecurring: boolean;
  created: string;
  modified: string;
  endDateUtc: string;
  startDateUtc: string;
  stationId: string;
  color?: string;
  originalId: string;
  start: string;
  end: string;
  scheduleRangeStartUtc: string;
  scheduleRangeEndUtc: string;
  metadata?: TrackMetadata;
}

export interface TrackMetadata {
  title: string;
  artist: string;
  album?: string;
  duration: number;
  artwork: {
    [key: string]: string;
  };
  playoutStartIsoTimestamp: string;
}