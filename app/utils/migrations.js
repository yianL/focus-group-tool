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

export default {};
