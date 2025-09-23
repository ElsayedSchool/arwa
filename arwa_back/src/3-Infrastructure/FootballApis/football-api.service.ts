import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';
import { TimeService } from '../timeService/time.service';

@Injectable()
export class FootballApiService {
  baseUrl = this.confSer.get('FOOTBALL_URL');
  clientSecret = this.confSer.get('FOOTBALL_SECRET');
  host = this.confSer.get('FOOTBALL_HOST');
  headers = {
    'X-RapidAPI-Key': this.clientSecret,
    'X-RapidAPI-Host': this.host,
  };
  constructor(
    @Inject('Logger') private log: Logger,
    private timeSer: TimeService,
    private confSer: ConfigService,
    private http: HttpService,
  ) {}

  async getAllCountries() {
    try {
      const resp = await lastValueFrom(
        this.http
          .get(this.baseUrl + 'countries', {
            headers: this.headers,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.log.error(error);
              throw 'An error happened!';
            }),
          ),
      );
      this.printError(resp, 'getAllCountries');
      return resp?.data['response'];
    } catch (error) {
      this.log.error('get all countries', error);
      return [];
    }
  }

  async getAllLeaguesByCountryName(params: { country: string }) {
    try {
      const resp = await lastValueFrom(
        this.http
          .get(this.baseUrl + 'leagues', {
            headers: this.headers,
            params,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.log.error(error.response.data);
              throw 'An error happened!';
            }),
          ),
      );
      this.printError(resp, 'getAllLeaguesByCountryName');
      return resp?.data['response'];
    } catch (error) {
      this.log.error('get all Leagues', error);
      return [];
    }
  }

  async getAllLeagueMatchesForaWeek(
    leagueId: number,
    season = this.timeSer.getCurrentSeason(),
  ) {
    try {
      const params = {
        league: leagueId,
        from: this.timeSer.getApiCurrentDate(),
        to: this.timeSer.getApiDateAfterOneWeek(),
        season: season,
      };
      const resp = await lastValueFrom(
        this.http
          .get(this.baseUrl + 'fixtures', {
            headers: this.headers,
            params,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.log.error('getAllLeaguesByCountryName', error);
              throw 'An error happened!';
            }),
          ),
      );

      this.printError(resp, 'getAllLeagueMatchesForaWeek');
      return resp?.data['response'];
    } catch (error) {
      this.log.error('get all League Matches', error);
      return [];
    }
  }

  async getAllLeagueTodayMatches(leagueId: number) {
    try {
      const params = {
        league: leagueId,
        date: this.timeSer.getApiCurrentDate(),
        season: this.timeSer.getCurrentSeason(),
      };
      const resp = await lastValueFrom(
        this.http
          .get(this.baseUrl + 'fixtures', {
            headers: this.headers,
            params,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.log.error('getAllLeagueTodayMatches', error.response.data);
              throw 'An error happened!';
            }),
          ),
      );
      this.printError(resp, 'getAllLeagueTodayMatches');
      return resp?.data['response'];
    } catch (error) {
      this.log.error('get all League Matches', error);
      return [];
    }
  }

  async getSelectedLeaguesLiveMatches(leaguesId: string) {
    try {
      const params = {
        ids: leaguesId,
        season: this.timeSer.getCurrentSeason(),
      };
      const resp = await lastValueFrom(
        this.http.get(this.baseUrl + 'fixtures', {
          headers: this.headers,
          params,
        }),
      );
      this.printError(resp, 'getSelectedLeaguesLiveMatches');
      return resp?.data['response'];
    } catch (error) {
      this.log.error('getSelectedLeaguesLiveMatches', error);
      return [];
    }
  }

  async getSelectedMatchesStatus(matchesIds: string) {
    try {
      const params = {
        ids: matchesIds,
      };
      const resp = await lastValueFrom(
        this.http.get(this.baseUrl + 'fixtures', {
          headers: this.headers,
          params,
        }),
      );
      this.printError(resp, 'getSelectedMatchesStatus');
      return resp?.data['response'];
    } catch (error) {
      this.log.error('getSelectedLeaguesLiveMatches', error);
      return [];
    }
  }

  async getSelectedCountryTeams(countryName: string) {
    try {
      const params = {
        country: countryName,
      };
      const resp = await lastValueFrom(
        this.http.get(this.baseUrl + 'teams', {
          headers: this.headers,
          params,
        }),
      );
      this.printError(resp, 'getSelectedCountryTeams');
      return resp?.data['response'];
    } catch (error) {
      this.log.error('getSelectedCountryTeams', error);
      return [];
    }
  }

  async getCurrentSeasonOfLeague(leagueId: number) {
    try {
      const resp = await lastValueFrom(
        this.http
          .get(this.baseUrl + 'leagues', {
            headers: this.headers,
            params: { id: leagueId, current: true },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.log.error(error.response?.data['errors']);
              throw 'An error happened!';
            }),
          ),
      );
      return this.printError(resp, 'getCurrentSeasonOfLeague')
        ? resp?.data['response'][0]?.seasons[0]
        : null;
    } catch (error) {
      this.log.error('getCurrentSeasonOfLeague', error);
      return null;
    }
  }

  private printError(resp: any, message: string) {
    if (resp?.data['errors']?.length) {
      this.log.error(message, resp);
      return null;
    }
    return true;
  }
}
