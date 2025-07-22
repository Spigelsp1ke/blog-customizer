import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group/RadioGroup';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';
import { Separator } from 'src/ui/separator';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';
import {
	fontSizeOptions,
	fontFamilyOptions,
	contentWidthArr,
	fontColors,
	backgroundColors,
	ArticleStateType,
	defaultArticleState,
} from 'src/constants/articleProps';

export const ArticleParamsForm = () => {
	const ref = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	const [isOpen, setIsOpen] = useState(false);

	const initialSnapshot = useRef(defaultArticleState);
	const [appliedState, setAppliedState] = useState(defaultArticleState);
	const [formState, setFormState] = useState(defaultArticleState);

	const openedInitialValuesRef = useRef<ArticleStateType | null>(null);
	const wasOpened = useRef(false);

	useEffect(() => {
		if (isOpen && !wasOpened.current) {
			openedInitialValuesRef.current = appliedState;
			setFormState(appliedState);
			wasOpened.current = true;
		}

		if (!isOpen) {
			openedInitialValuesRef.current = null;
			wasOpened.current = false;
		}
	}, [isOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen]);

	const applyStylesToRoot = (styles: ArticleStateType) => {
		const root = document.documentElement;
		root.style.setProperty('--font-family', styles.fontFamilyOption.value);
		root.style.setProperty('--font-size', styles.fontSizeOption.value);
		root.style.setProperty('--font-color', styles.fontColor.value);
		root.style.setProperty('--container-width', styles.contentWidth.value);
		root.style.setProperty('--bg-color', styles.backgroundColor.value);
	};

	const handleChange = <K extends keyof ArticleStateType>(
		field: K,
		value: ArticleStateType[K]
	) => {
		setFormState((prev) => ({ ...prev, [field]: value }));
	};

	const handleReset = (e: React.FormEvent) => {
		e.preventDefault();
		const snapshot = initialSnapshot.current;
		if (snapshot) {
			setFormState(snapshot);
			setAppliedState(snapshot);
			applyStylesToRoot(snapshot);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setAppliedState(formState);
		applyStylesToRoot(formState);
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
			<aside
				className={clsx(styles.container, { [styles.container_open]: isOpen })}
				ref={ref}>
				<form
					ref={formRef}
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text size={31} weight={800} uppercase>
						Задайте параметры
					</Text>

					<div>
						<Text size={12} weight={800} uppercase>
							Шрифт
						</Text>
						<Select
							selected={formState.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={(value) => handleChange('fontFamilyOption', value)}
						/>
					</div>

					<div>
						<Text size={12} weight={800} uppercase>
							Размер шрифта
						</Text>
						<RadioGroup
							name='fontSizeOption'
							options={fontSizeOptions}
							selected={formState.fontSizeOption}
							onChange={(value) => handleChange('fontSizeOption', value)}
							title=''
						/>
					</div>

					<div>
						<Text size={12} weight={800} uppercase>
							Цвет шрифта
						</Text>
						<Select
							selected={formState.fontColor}
							options={fontColors}
							onChange={(value) => handleChange('fontColor', value)}
						/>
					</div>

					<Separator />

					<div>
						<Text size={12} weight={800} uppercase>
							Цвет фона
						</Text>
						<Select
							selected={formState.backgroundColor}
							options={backgroundColors}
							onChange={(value) => handleChange('backgroundColor', value)}
						/>
					</div>

					<div>
						<Text size={12} weight={800} uppercase>
							Ширина контента
						</Text>
						<Select
							selected={formState.contentWidth}
							options={contentWidthArr}
							onChange={(value) => handleChange('contentWidth', value)}
						/>
					</div>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button
							title='Применить'
							htmlType='submit'
							type='apply'
							onClick={() => formRef.current?.requestSubmit()}
						/>
					</div>
				</form>
			</aside>
		</>
	);
};
