import {createLocalVue, mount} from '@vue/test-utils'
import App from "@/App";
import {getters, state} from "@/store";
import Vuex from "vuex";

let wrapper
beforeEach(() => {
    wrapper = mountComponent(App)

})

describe("App.vue", () => {
    test("should rendering", () => {
        expect(wrapper.exists()).toBeTruthy()
    })
    test("h1 exits and text check", () => {
        const h1 = wrapper.find('h1')
        expect(h1.exists()).toBeTruthy()
        expect(h1.text()).toEqual("Daily Corona Cases in Turkey")

    })
    it.each`
    case | count | style
    ${'when count equal to 15'} | ${11} | ${"danger"}
    ${'when count equal to 5'} | ${7} | ${"normal"}
    ${'when count equal to 1'} | ${4} | ${"safe"}
    `('returns $expectedStyle when $caseName with $countValue',
        async ({count, style}) => {
        wrapper.vm.$store.state.count = count
            await wrapper.vm.$nextTick()
            const element = wrapper.find('.notificationArea')
            expect(element.classes()).toContain(style)
        });

    test("notificationArea text message check", async () => {
        wrapper.vm.$store.state.count = 15
        await wrapper.vm.$nextTick()
        let notificationArea = wrapper.find('.notificationArea').text()
        expect(notificationArea).toEqual("Danger!!! Case count is 15k")

        wrapper.vm.$store.state.count = 7
        await wrapper.vm.$nextTick()
        notificationArea = wrapper.find('.notificationArea').text()
        expect(notificationArea).toEqual("Life is normal. Case count is 7k")

        wrapper.vm.$store.state.count = 3
        await wrapper.vm.$nextTick()
        notificationArea = wrapper.find('.notificationArea').text()
        expect(notificationArea).toEqual("So safe. Case count is 3k")


    })

})

function mountComponent() {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    return mount(App, {
        localVue,
        store: new Vuex.Store({
            state: JSON.parse(JSON.stringify(state)),
            getters,
        }),
    });
}