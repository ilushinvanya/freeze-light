<template>
	<div>
		<div
			class="flex column relative-position"
			:class="{ 'mirror': isMirrored }"
		>
			<video ref="video" autoplay playsinline></video>
			<canvas ref="canvas"></canvas>
		</div>

		<div class="fixed-bottom z-fab">
			<q-separator/>
			<div class="row q-pa-md">
				<div class="col col-4 flex flex-center">
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
								size="2.4em"
								color="white"
								:name="isInitStream ? 'videocam' : 'videocam_off'"
							/>
						</q-btn>
				</div>
				<div class="col col-4 flex flex-center">
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
				</div>
				<div class="col col-4 flex flex-center">
					<div class="text-h3">{{time / 10}}</div>
				</div>
			</div>
			<q-separator/>
			<div class="row q-pa-md">
				<div class="col col-4 flex flex-center">
					<div>
						<q-btn no-caps color="info" rounded @click="save" size="lg" label="Save"/>
					</div>
				</div>

				<div class="col col-4 flex justify-around items-center">
					<div>
						<q-btn class="q-pa-none" color="primary" size="lg" fab>
							<q-icon
								size="2.4em"
								color="white"
								name="flip_camera_ios"
							/>
							<q-menu :class="{ 'left-0-important max-width-none-important' : isMobile }"
									:style="{ 'width' : width }" :max-width="width">
								<div class="q-pa-md">
									<q-select
										v-if="videoDevices.length"
										v-model="selectedDevice"
										:options="videoDevices"
										option-label="label"
										option-value="deviceId"
										map-options
										outlined
										dense
										class="q-ma-md"
										@update:model-value="changeCamera"
									/>
								</div>
							</q-menu>
						</q-btn>
					</div>
					<div>
						<q-btn class="q-pa-none" color="primary" @click="toggleMirror" size="lg" fab>
							<q-icon
								size="2.4em"
								color="white"
								name="switch_video"
								:class="{ 'mirror-icon': isMirrored }"
							/>
						</q-btn>
					</div>
				</div>

				<div class="col col-4 flex flex-center">
					<div>
						<q-btn no-caps color="orange" rounded @click="reset" size="lg" label="Reset" />
					</div>
				</div>

			</div>
		</div>

		<q-dialog v-model="isOpenImage">
			<q-card>
				<img :src="capturedImage" />
				<q-card-actions>
					<q-btn
						no-caps
						color="info"
						rounded
						label="Download"
						@click="downloadImage" icon="save"/>
					<q-space/>
					<q-btn no-caps label="Close" @click="isOpenImage = false"/>
				</q-card-actions>
			</q-card>


		</q-dialog>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { useQuasar } from 'quasar';
	import { useTimer } from 'src/hooks/useTimer';

	interface IDevice {
		label: string;
		deviceId: string
	}
	const $q = useQuasar();

	const isMobile = $q.platform.is.mobile;

	const width = computed(() => isMobile ? '100%' : 'auto')


	const video = ref<HTMLVideoElement | null>(null);
	const canvas = ref<HTMLCanvasElement | null>(null);

	const selectedDevice = ref<IDevice | null>(null);
	const videoDevices = ref<IDevice[]>([]);

	const { time, startInterval, stopInterval, continueInterval } = useTimer();

	const getVideoDevices = async () => {
		await navigator.mediaDevices.getUserMedia({audio: false, video: true});
		const devices = await navigator.mediaDevices.enumerateDevices();
		videoDevices.value = devices.filter(device => device.kind === 'videoinput').map(({ label, deviceId }) => ({ label, deviceId }));
		if (videoDevices.value.length > 0) {
			selectedDevice.value = videoDevices.value[0];
		}
	};
	const startStream = async (deviceId: string, setSize = true) => {
		if (video.value) {
			isInitStream.value = true;
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { deviceId: { exact: deviceId } }
			});
			video.value.srcObject = stream;

			video.value.onloadedmetadata = () => {
				if(setSize) {
					setCanvasSize()
				}
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
			if (selectedDevice.value) {
				await startStream(selectedDevice.value.deviceId, false);
			}
		}
	};
	onMounted(async () => {
		await getVideoDevices();
		if (selectedDevice.value) {
			await startStream(selectedDevice.value.deviceId);
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

	const changeCamera = (event: IDevice) => {
		if (selectedDevice.value) {
			startStream(event.deviceId);
		}
	};

	const playPause = () => {
		if(isRecord.value) {
			stopInterval()
		}
		if(!isRecord.value) {
			if(time.value > 0) continueInterval()
			else startInterval()
		}
		isRecord.value = !isRecord.value
	};

	const isOpenImage = ref(false);
	const capturedImage = ref<string>('');
	const save = () => {
		if(!canvas.value) return;
		capturedImage.value = canvas.value.toDataURL('image/jpeg', 1.0);
		isOpenImage.value = true;
	}

	function downloadImage() {
		if(!capturedImage.value) return;
		const a = document.createElement('a');
		a.href = capturedImage.value;
		a.download = 'freeze-light-' + time.value / 10 + 's.jpeg';
		document.body.appendChild(a);
		a.click();
	}

	const reset = () => {
		if (selectedDevice.value) {
			startStream(selectedDevice.value.deviceId);
		}
		stopInterval();
		isRecord.value = false;
		time.value = 0;
	}

	const isMirrored = ref(false);
	const toggleMirror = () => {
		isMirrored.value = !isMirrored.value;
	}

</script>

<style lang="scss">
.mirror {
	video, canvas {
		transform: scale(-1, 1);
	}
}
.mirror-icon {
	transform: scale(-1, 1);
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

.left-0-important {
	left: 0 !important;
}
.max-width-none-important {
	max-width: none !important;
}
</style>
