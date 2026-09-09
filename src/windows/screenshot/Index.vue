<script setup lang="ts">
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n()
</script>

<template>
	<main>{{ t('windows.screenshot') }}</main>
	<ShadcnToaster />
</template>
