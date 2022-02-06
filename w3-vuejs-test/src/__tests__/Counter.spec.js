import Counter from "@/Counter";
import {createLocalVue, mount, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import {actions, getters, mutations, state} from "@/store";

let wrapper;

beforeEach(() => {
    wrapper = mountComponent(Counter)

})
describe("Counter.vue", () => {

    it("Component exits check", () => {
        expect(wrapper.exists()).toBeTruthy()
    })
    it("increase button exist check", () => {
        const increaseButton =  findButton(wrapper,"Increase")
        expect(increaseButton.exists()).toBeTruthy()
    })
    it("decrease button exist check", () => {
        const decreaseButton =  findButton(wrapper,"Decrease")
        expect(decreaseButton.exists()).toBeTruthy()
    })
    it("increase button functionality check", async () => {
        const dispatchMock = jest.fn()

        const wrapperButton = shallowMount(Counter, {
            mocks:{
                $store:{
                    state,
                    dispatch:dispatchMock
                }
            }
        })
        let increaseButton = findButton(wrapperButton,"Increase")
        await increaseButton.trigger("click")
        expect(dispatchMock).toHaveBeenCalledWith('increment')

    })
    it("decrease button functionality check", async () => {
        const dispatchMock = jest.fn()
        const wrapperButton = shallowMount(Counter, {
            mocks:{
                $store:{
                    state,
                    dispatch:dispatchMock
                }
            }
        })

        let decreaseButton = findButton(wrapperButton,"Decrease")
        await decreaseButton.trigger("click")
        expect(dispatchMock).toHaveBeenCalledWith('decrement')

    })
    it("2 inc 1 decr buttons functionality check", async () => {

        let increaseButton = findButton(wrapper,"Increase")
        let decreaseButton = findButton(wrapper,"Decrease")

        await increaseButton.trigger("click")
        await increaseButton.trigger("click")
        await decreaseButton.trigger("click")
        expect(wrapper.vm.$store.state.count).toEqual(1)

    })
    it("count text show check", async () => {
        let increaseButton = findButton(wrapper,"Increase")
        await increaseButton.trigger("click")
        expect(wrapper.vm.$store.state.count).toEqual(1)

        const CountView = wrapper.find("span")
        expect(CountView.text()).toEqual( `${wrapper.vm.$store.state.count}k`)
        // console.log(CountView.text())
    })
})

function findButton(wrapperName, buttonCheck) {
    const Button = wrapperName.findAll("button")
    let myButton
    for (let i = 0; i < Button.length; i++) {
        if (Button.at(i).text() === buttonCheck) {
            myButton = Button.at(i)
        }
    }
    return myButton
}


function mountComponent() {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    return mount(Counter, {
        localVue,
        store: new Vuex.Store({
            state: JSON.parse(JSON.stringify(state)),
            getters,
            mutations,
            actions,
        }),
    });
}