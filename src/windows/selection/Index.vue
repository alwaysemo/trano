<script setup lang="ts">
	import { useI18n } from 'vue-i18n'
	import Toast from '@/components/base/Toast.vue'

	const { t } = useI18n()
</script>

<template>
	<main>{{ t('windows.selection') }}</main>
	<Toast />
</template>
