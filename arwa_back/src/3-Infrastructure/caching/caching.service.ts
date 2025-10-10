import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisClientType, createClient } from "redis";
import { BcryptService } from "../Authentication/Bcrypt/bycrypt.Service";
import { CacheEntityType } from "src/2-Domain";

@Injectable()
export class CachingService {
  redisClient: RedisClientType;
  redisSub: RedisClientType;
  constructor(
    private configSer: ConfigService,
    private hashSer: BcryptService
  ) {
    this.redisClient = createClient({
      password: this.configSer.get("REDIS_PASS"),
      url: `redis://localhost:6379`,
    });
    this.redisSub = createClient({
      password: this.configSer.get("REDIS_PASS"),
      url: `redis://localhost:6379`,
    });
    this.redisClient.connect();
    this.redisSub.connect();
    this.redisSub.on("message", (channel, count) => {
      console.log("Main page", channel, count);
    });
  }

  // get row from entity
  async hQueryEntity(entity: CacheEntityType, rowKey: any) {
    const key = await this.hashSer.getHashedKey(rowKey);
    const data = await this.redisClient.hGet(entity, key);
    if (!data) return null;
    return JSON.parse(data as string);
  }

  // add row to entity
  async hAddRowToEntity(
    entity: CacheEntityType,
    rowKey: any,
    rowValue: any,
    expireInSec = 5
  ) {
    const key = await this.hashSer.getHashedKey(rowKey);
    await this.redisClient.hSet(entity, key, JSON.stringify(rowValue));
    if (expireInSec) await this.redisClient.expire(entity, expireInSec);
  }

  // clear entity
  async hClearEntity(entity: CacheEntityType) {
    await this.redisClient.del(entity);
  }

  // get row from entity
  async queryEntity(entity: CacheEntityType, rowKey: any) {
    const key = await this.hashSer.getHashedKey(rowKey);
    const data = await this.redisClient.get(entity + key);
    if (!data) return null;
    return JSON.parse(data as string);
  }

  // add row to entity
  async addRowToEntity(
    entity: CacheEntityType,
    rowKey: any,
    rowValue: any,
    expireInSec = 5
  ) {
    const key = await this.hashSer.getHashedKey(rowKey);
    await this.redisClient.set(entity + key, JSON.stringify(rowValue));
    if (expireInSec) await this.redisClient.expire(entity + key, expireInSec);
  }

  // clear entity
  async clearEntity(entity: CacheEntityType) {
    await this.redisClient.del(entity);
  }

  public async publishMessage(channel: string, message: string) {
    await this.redisClient.publish(channel, message);
  }

  public async subscribeToChannel(channel: string) {
    await this.redisSub.subscribe(channel, () => {
      console.log("dsdsadasdasd");
    });
  }

  public async isNotLocked(lockKey: string, expiration = 3600) {
    return (
      (await this.redisClient.set(lockKey, "locked", {
        EX: expiration,
        NX: true,
      })) === "OK"
    );
  }
}
