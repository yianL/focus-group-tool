import moment from 'moment';

export function migrationSaveNameEmailDate(db) {
  if (db.has('migrationSaveNameEmailDate')) {
    return;
  }
  const data = db.get('pastParticipants', []);

  console.log(`Starting "pastParticipants" migration. ${data.length} records to migrate.`);

  const now = Date.now();
  const migrated = data.map(ent => ({
    name: ent.name,
    email: ent.email.toLowerCase(),
    createdAt: now,
    lastFocusGroupDate: null,
    released: false,
  }));

  db.set('pastParticipants', migrated);
  db.set('migrationSaveNameEmailDate', now);

  console.log('Finished "pastParticipants" migration.');
}

const AUTO_RELEASE_AGE = moment.duration(18, 'months').asMilliseconds()

export function scanAndReleaseCandidates(db) {
  const data = db.get('pastParticipants', []);

  console.log('Scanning past participants...');

  let count = 0;
  const now = Date.now();
  const migrated = data.map(d => {
    if (!d.lastFocusGroupDate || d.released) {
      return d;
    }
    if ((d.lastFocusGroupDate - now) > AUTO_RELEASE_AGE) {
      count += 1;
      return {
        ...d,
        released: true,
      };
    }
    return d;
  });

  db.set('pastParticipants', migrated);

  console.log(`Released ${count} participants.`);
}

export default {};
