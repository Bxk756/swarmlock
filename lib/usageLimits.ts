export const USAGE_LIMITS = {
  free: {
    "/api/swarm-lock/event": 1_000,
    "/api/swarm-lock/event/write": 100,
  },
  pro: {
    "/api/swarm-lock/event": 100_000,
    "/api/swarm-lock/event/write": 10_000,
  },
};
