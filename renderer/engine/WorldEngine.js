import { State } from './State.js';

/**
 * WorldEngine.js — v2.5 世界引擎
 * 负责天气、季节、灵气浓度、月相、气运等世界状态
 * 所有事件概率参考 WorldState
 */

const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
const WEATHERS = ['clear', 'cloudy', 'rain', 'storm', 'snow', 'fog'];
const MOON_PHASES = ['new', 'crescent', 'quarter', 'gibbous', 'full'];

export class WorldEngine {
  constructor() {
    this.worldState = {
      season: 'spring',
      seasonProgress: 0,      // 0-100
      weather: 'clear',
      weatherDuration: 0,     // 天气持续秒数
      moonPhase: 'new',
      moonDay: 1,             // 1-30
      spiritualEnergy: 1.0,   // 灵气浓度倍率
      worldQi: 0,            // 世界灵气总量
    };
    this.tickCounter = 0;
  }

  /** 每 tick 更新世界状态 */
  tick() {
    this.tickCounter++;

    // 每 60 ticks 更新天气（约1分钟）
    if (this.tickCounter % 60 === 0) {
      this.updateWeather();
    }

    // 每 300 ticks 更新季节（约5分钟）
    if (this.tickCounter % 300 === 0) {
      this.updateSeason();
    }

    // 每 120 ticks 更新月相（约2分钟）
    if (this.tickCounter % 120 === 0) {
      this.updateMoon();
    }

    // 灵气浓度缓慢波动
    this.updateSpiritualEnergy();
  }

  updateWeather() {
    const roll = Math.random();
    let newWeather = 'clear';

    // 季节影响天气概率
    const season = this.worldState.season;
    if (season === 'spring') {
      if (roll < 0.3) newWeather = 'rain';
      else if (roll < 0.5) newWeather = 'fog';
    } else if (season === 'summer') {
      if (roll < 0.2) newWeather = 'storm';
      else if (roll < 0.4) newWeather = 'cloudy';
    } else if (season === 'autumn') {
      if (roll < 0.3) newWeather = 'cloudy';
      else if (roll < 0.4) newWeather = 'fog';
    } else if (season === 'winter') {
      if (roll < 0.3) newWeather = 'snow';
      else if (roll < 0.5) newWeather = 'cloudy';
    }

    this.worldState.weather = newWeather;
    this.worldState.weatherDuration = Math.floor(Math.random() * 120) + 60;
  }

  updateSeason() {
    this.worldState.seasonProgress += 10;
    if (this.worldState.seasonProgress >= 100) {
      this.worldState.seasonProgress = 0;
      const idx = SEASONS.indexOf(this.worldState.season);
      this.worldState.season = SEASONS[(idx + 1) % 4];
    }
  }

  updateMoon() {
    this.worldState.moonDay++;
    if (this.worldState.moonDay > 30) this.worldState.moonDay = 1;

    if (this.worldState.moonDay < 3) this.worldState.moonPhase = 'new';
    else if (this.worldState.moonDay < 8) this.worldState.moonPhase = 'crescent';
    else if (this.worldState.moonDay < 15) this.worldState.moonPhase = 'quarter';
    else if (this.worldState.moonDay < 22) this.worldState.moonPhase = 'gibbous';
    else this.worldState.moonPhase = 'full';
  }

  updateSpiritualEnergy() {
    // 灵气浓度随天气和季节波动
    let base = 1.0;

    if (this.worldState.weather === 'storm') base += 0.3;
    if (this.worldState.weather === 'rain') base += 0.1;
    if (this.worldState.season === 'spring') base += 0.1;
    if (this.worldState.moonPhase === 'full') base += 0.2;
    if (this.worldState.moonPhase === 'new') base -= 0.1;

    // 缓慢趋向目标值
    const current = this.worldState.spiritualEnergy;
    this.worldState.spiritualEnergy = current + (base - current) * 0.01;
  }

  /** 获取事件概率修正 */
  getEventModifiers(eventType) {
    const mods = {};

    // 雷雨天增加危机事件概率
    if (this.worldState.weather === 'storm') {
      if (eventType === 'crisis') mods.weight = 2;
      if (eventType === 'realm_event') mods.weight = 1.5;
    }

    // 满月增加心魔类事件
    if (this.worldState.moonPhase === 'full') {
      if (eventType === 'crisis') mods.weight = 1.5;
    }

    // 春季增加奇遇
    if (this.worldState.season === 'spring') {
      if (eventType === 'qi') mods.weight = 1.3;
    }

    // 灵气浓度影响修为获取
    mods.cultivationMultiplier = this.worldState.spiritualEnergy;

    return mods;
  }

  /** 获取世界状态描述 */
  getWorldDescription() {
    const seasonMap = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' };
    const weatherMap = { clear: '晴朗', cloudy: '多云', rain: '下雨', storm: '雷雨', snow: '下雪', fog: '浓雾' };
    const moonMap = { new: '新月', crescent: '蛾眉月', quarter: '弦月', gibbous: '盈凸月', full: '满月' };

    return {
      season: seasonMap[this.worldState.season] || this.worldState.season,
      weather: weatherMap[this.worldState.weather] || this.worldState.weather,
      moon: moonMap[this.worldState.moonPhase] || this.worldState.moonPhase,
      spiritualEnergy: Math.round(this.worldState.spiritualEnergy * 100) + '%'
    };
  }

  /** 序列化 */
  serialize() {
    return { ...this.worldState };
  }

  /** 反序列化 */
  deserialize(data) {
    if (data) this.worldState = { ...this.worldState, ...data };
  }

  /** 重置 */
  reset() {
    this.worldState = {
      season: 'spring',
      seasonProgress: 0,
      weather: 'clear',
      weatherDuration: 0,
      moonPhase: 'new',
      moonDay: 1,
      spiritualEnergy: 1.0,
      worldQi: 0
    };
    this.tickCounter = 0;
  }
}

export const worldEngine = new WorldEngine();
