import http from '@/api/http'

const reportInteraction = function (action, message) {
  return http.post('/interaction', { action, message });
}

const service = {
  reportInteraction,
}

export default service
