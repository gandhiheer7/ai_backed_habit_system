import fs from 'fs';
import path from 'path';
import { Habit, CheckIn, UserProfile } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const HABITS_FILE = path.join(DATA_DIR, 'habits.json');
const CHECKINS_FILE = path.join(DATA_DIR, 'checkins.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generic Read/Write
function readJSON<T>(filePath: string, defaultValue: T): T {
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return defaultValue;
  }
}

function writeJSON(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export const db = {
  habits: {
    getAll: (userId: string) => readJSON<Habit[]>(HABITS_FILE, []).filter(h => h.userId === userId),
    getById: (id: string) => readJSON<Habit[]>(HABITS_FILE, []).find(h => h.id === id),
    create: (habit: Habit) => {
      const all = readJSON<Habit[]>(HABITS_FILE, []);
      all.push(habit);
      writeJSON(HABITS_FILE, all);
      return habit;
    },
    update: (id: string, updates: Partial<Habit>) => {
      const all = readJSON<Habit[]>(HABITS_FILE, []);
      const index = all.findIndex(h => h.id === id);
      if (index === -1) return null;
      
      all[index] = { ...all[index], ...updates };
      writeJSON(HABITS_FILE, all);
      return all[index];
    }
  },
  checkins: {
    getAll: (userId: string) => readJSON<CheckIn[]>(CHECKINS_FILE, []).filter(c => c.userId === userId),
    create: (checkin: CheckIn) => {
      const all = readJSON<CheckIn[]>(CHECKINS_FILE, []);
      all.push(checkin);
      writeJSON(CHECKINS_FILE, all);
      return checkin;
    }
  },
  users: {
    get: (id: string) => readJSON<UserProfile[]>(USERS_FILE, []).find(u => u.id === id),
    update: (profile: UserProfile) => {
      const all = readJSON<UserProfile[]>(USERS_FILE, []);
      const index = all.findIndex(u => u.id === profile.id);
      if (index !== -1) {
        all[index] = profile;
      } else {
        all.push(profile);
      }
      writeJSON(USERS_FILE, all);
      return profile;
    }
  }
};