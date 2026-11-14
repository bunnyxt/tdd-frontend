// History IDs and timestamps each form only part of a record's identity.
export function recordKey(record, index) {
  const entity = record.aid === undefined ? record.mid : record.aid;
  if (entity !== undefined && record.added !== undefined && record.id !== undefined) {
    return JSON.stringify([entity, record.added, record.id]);
  }
  return JSON.stringify([entity, record.added, record.id, index]);
}

export function recordsByTime(records) {
  return [...(records || [])].sort((a, b) => a.added - b.added);
}

export function recentRecords(records, count) {
  return recordsByTime(records).slice(-count);
}
