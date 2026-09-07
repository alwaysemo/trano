<script setup lang="ts">
	import { useI18n } from 'vue-i18n'
	import Toast from '@components/base/Toast/Index.vue'

	const { t } = useI18n()
</script>

<template>
	<main>{{ t('windows.screenshot') }}</main>
	<Toast />
</template>
