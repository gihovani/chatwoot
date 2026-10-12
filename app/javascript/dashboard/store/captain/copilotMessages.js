import CopilotMessagesAPI from 'dashboard/api/captain/copilotMessages';
import { createStore } from '../storeFactory';

export default createStore({
  name: 'CopilotMessages',
  API: CopilotMessagesAPI,
  getters: {
    getMessagesByThreadId: state => copilotThreadId => {
      return state.records
        .filter(record => record.copilot_thread?.id === Number(copilotThreadId))
        .sort((a, b) => a.id - b.id);
    },
  },
  actions: mutationTypes => ({
    // Merges by ID, so a saved approval status and any message the panel missed replace what it holds, and other
    // threads stay as they are.
    async fetchThread({ commit }, { threadId }) {
      const response = await CopilotMessagesAPI.get(threadId);
      response.data.payload.forEach(message =>
        commit(mutationTypes.UPSERT, message)
      );
    },
    upsert({ commit }, data) {
      commit(mutationTypes.UPSERT, data);
    },
  }),
});
