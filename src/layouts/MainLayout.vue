<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-black">
      <q-toolbar>
        <q-toolbar-title>
			<div class="font-alfa text-center">FreezeLight</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Abril+Fatface|Alfa+Slab+One|Anton|Berkshire+Swash|Chewy|Kaushan+Script');
.font-alfa {
	font-family: 'Alfa Slab One', cursive;
}
</style>
