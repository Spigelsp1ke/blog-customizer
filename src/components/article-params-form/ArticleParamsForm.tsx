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
} from 'src/constants/articleProps';

interface Props {
	isOpen: boolean;
	onToggle: () => void;
	initialValues: ArticleStateType;
	onApply: (newState: ArticleStateType) => void;
	defaultSnapshot: ArticleStateType;
}

export const ArticleParamsForm = ({
	isOpen,
	onToggle,
	initialValues,
	onApply,
	defaultSnapshot,
}: Props) => {
	const ref = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	const [formState, setFormState] = useState(initialValues);

	const openedInitialValuesRef = useRef<ArticleStateType | null>(null);
	const wasOpened = useRef(false);

	useEffect(() => {
		if (isOpen && !wasOpened.current) {
			openedInitialValuesRef.current = initialValues;
			setFormState(initialValues);
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
				onToggle();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen, onToggle]);

	const handleChange = <K extends keyof ArticleStateType>(
		field: K,
		value: ArticleStateType[K]
	) => {
		setFormState((prev) => ({ ...prev, [field]: value }));
	};

	const handleReset = (e: React.FormEvent) => {
		e.preventDefault();
		setFormState(defaultSnapshot);
		onApply({ ...defaultSnapshot });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(formState);
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={onToggle} />
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
