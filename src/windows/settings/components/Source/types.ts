export interface SourceOption {
	key: string
	/** 选项名称的 i18n key */
	nameKey: string
	/** 占位提示的 i18n key */
	placeholderKey: string
	value: string
	/** 密钥类字段以密码形式输入 */
	password?: boolean
}

export interface Source {
	/** 翻译源标识，内置源为固定字符串，自定义源为 custom- 前缀 */
	type: string
	/** 展示名称的兜底文案（自定义源为用户填写的名称） */
	label: string
	/** 内置源名称的 i18n key */
	labelKey?: string
	value: boolean
	/** 自定义源没有品牌图标，模板中回退到通用图标 */
	icon?: string
	hintKey: string
	custom?: boolean
	options: SourceOption[]
}

/** 持久化到后端 sources.json 的翻译源配置 */
export interface SourceEntry {
	id: string
	enabled: boolean
	options: Record<string, string>
}
