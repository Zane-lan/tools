import { mount } from '@vue/test-utils';
import TimeTools from '@/views/TimeTools.vue';

describe('TimeTools.vue', () => {
    it('displays current timestamp', () => {
        const wrapper = mount(TimeTools);
        expect(wrapper.find('.timestamp').exists()).toBe(true);
    });
    
    it('converts time to timestamp correctly', async () => {
        const wrapper = mount(TimeTools);
        await wrapper.setData({
            timeInput: '2024-03-07 12:00:00'
        });
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.convertedTimestamp).toBe(1709784000000);
    });
}); 