// Cache simples em memória com TTL para respostas JSON

const cacheStore = new Map();

function cache(seconds) {
  const ttlMs = seconds * 1000;
  return function cacheMiddleware(req, res, next) {
    try {
      const key = req.originalUrl;
      const cached = cacheStore.get(key);
      const now = Date.now();
      if (cached && cached.expiry > now) {
        res.set('X-Cache', 'HIT');
        res.set('Cache-Control', `public, max-age=${seconds}`);
        return res.json(cached.body);
      }

      const originalJson = res.json.bind(res);
      res.json = (body) => {
        cacheStore.set(key, { expiry: now + ttlMs, body });
        res.set('X-Cache', 'MISS');
        res.set('Cache-Control', `public, max-age=${seconds}`);
        return originalJson(body);
      };

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { cache };


