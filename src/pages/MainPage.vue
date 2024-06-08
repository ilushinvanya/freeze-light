<template>
	<div>
<!--			<div class="timer">0.0</div>-->
<!--			<p class="hamburger" onclick="toggleMenu()">-->
<!--				-->
		<div class="flex column relative-position">
			<video ref="video" autoplay playsinline></video>
			<canvas ref="canvas"></canvas>
<!--			<img :src="capturedImage" alt="Captured Image" v-if="capturedImage"/>-->
		</div>


		<div class="absolute-bottom">
			<q-separator/>
			<div class="flex justify-around q-pa-md">
				<q-btn
					:color="isInitStream ? 'primary' : 'default'"
					class="q-pa-none"
					size="lg"
					fab
					:outline="!isInitStream"
					rounded
					@click="toggleStream"
				>
					<q-icon
						size="2em"
						color="white"
						name="videocam"
					/>
				</q-btn>
				<q-btn
					color="white"
					class="q-pa-none"
					fab
					@click="playPause"
					size="lg"
					:outline="isRecord"
				>
					<q-icon
						size="4em"
						color="red"
						:name="isRecord ? 'stop' : 'fiber_manual_record'"
					/>
				</q-btn>
				<div></div>
			</div>
			<q-separator/>
			<div class="flex justify-around q-pa-md">
				<q-btn no-caps color="info" rounded @click="save" size="lg" label="Save" icon="save"/>

				<q-btn color="primary" @click="save" size="lg" fab icon="menu">
					<q-menu>
						<q-card>
							<q-select
								v-if="videoDevices.length"
								v-model="selectedDeviceId"
								:options="videoDevices"
								option-label="label"
								option-value="deviceId"
								map-options
								outlined
								dense
								class="q-ma-md"
								@change="changeCamera"
							/>
							<div class="column items-center">
								<li>Отзеркалить</li>
								<li>Ваш список фоток</li>
							</div>
						</q-card>
					</q-menu>
				</q-btn>

				<q-btn no-caps color="orange" rounded @click="reset" size="lg" label="Reset" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';

	const video = ref<HTMLVideoElement | null>(null);
	const canvas = ref<HTMLCanvasElement | null>(null);

	const selectedDeviceId = ref<string | null>(null);
	const videoDevices = ref<MediaDeviceInfo[]>([]);

	const capturedImage = ref<string | null>(null);
	const timer = ref(0);

	const getVideoDevices = async () => {
		const devices = await navigator.mediaDevices.enumerateDevices();
		videoDevices.value = devices.filter(device => device.kind === 'videoinput');
		if (videoDevices.value.length > 0) {
			selectedDeviceId.value = videoDevices.value[0].deviceId;
		}
	};
	const startStream = async (deviceId: string) => {
		if (video.value) {
			isInitStream.value = true;
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { deviceId: { exact: deviceId } }
			});
			video.value.srcObject = stream;

			video.value.onloadedmetadata = () => {
				setCanvasSize()
			};
			requestAnimationFrame(drawFrame)
		}
	};
	const setCanvasSize = () => {
		if(canvas.value && video.value) {
			canvas.value.width = video.value.videoWidth;
			canvas.value.height = video.value.videoHeight;
		}
	};

	const isInitStream = ref(false);

	const destroyStream = () => {
		if (video.value) {
			video.value.srcObject = null;
			isInitStream.value = false;
		}
	}
	const toggleStream = async () => {
		if(isInitStream.value) {
			destroyStream()
		}
		else {
			if (selectedDeviceId.value) {
				await startStream(selectedDeviceId.value);
			}
		}
	}
	onMounted(async () => {
		await getVideoDevices();
		if (selectedDeviceId.value) {
			await startStream(selectedDeviceId.value);
		}
	});

	const isRecord = ref(false)
	const drawFrame = () => {
		if (canvas.value && video.value) {
			const ctx = canvas.value.getContext('2d');
			if (ctx) {
				if(isRecord.value) {
					ctx.globalCompositeOperation = 'lighten';
					ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
				} else {
					ctx.globalCompositeOperation = 'source-in';
				}
				requestAnimationFrame(drawFrame)
			}
		}
	};

	const changeCamera = () => {
		if (selectedDeviceId.value) {
			startStream(selectedDeviceId.value);
		}
	};

	function playPause() { // toogle Play (0)
		isRecord.value = !isRecord.value
	}

	function save() {
		// capturedImage.value = canvas.value.toDataURL('image/png'); // SAVE
		// var fullQuality = displayCanvas.toDataURL('image/jpeg', 0.2);
		// console.log(fullQuality);
		// $('#app').append('<img src=' + localStorage.getItem('image') + '/>');
		// localStorage.setItem('image', fullQuality);
	}

	function reset() {
		setCanvasSize()
		if (selectedDeviceId.value) {
			startStream(selectedDeviceId.value);
		}
		// timer = 0;
		// flag.value = 0;
		// saveEl.hide();
		// resetEl.hide();
	}

</script>

<style lang="scss">
.mirror {
	video, canvas {
		transform: scale(-1, 1);
	}
}


video {
	position: absolute;
	z-index: 9;
	width: 100%;
}

canvas {
	position: absolute;
	z-index: 10;
	width: 100%;
	display: block;
	mix-blend-mode: lighten;
}

</style>
