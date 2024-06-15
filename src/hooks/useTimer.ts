import { ref } from 'vue';

export const useTimer = () => {
    let timer = 0
    const time = ref(0)

    const startInterval = () => {
        stopInterval()
        time.value = 0
        timer = window.setInterval(() => {
            time.value++
        }, 100)
    }

    const stopInterval = () => {
        clearInterval(timer)
    }

	const continueInterval = () => {
		timer = window.setInterval(() => {
			time.value++
		}, 100)
	}

    return { time, startInterval, stopInterval, continueInterval }
}
