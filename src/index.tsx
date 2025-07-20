import { createRoot } from 'react-dom/client';
import { StrictMode, CSSProperties, useState, useRef } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
	defaultArticleState,
	ArticleStateType,
} from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [stylesState, setStylesState] = useState(defaultArticleState);
	const defaultSnapshot = useRef(defaultArticleState);

	const handleApply = (newStyles: ArticleStateType) => {
		setStylesState({ ...newStyles });
	};

	return (
		<main
			className={clsx(styles.main)}
			style={
				{
					'--font-family': stylesState.fontFamilyOption.value,
					'--font-size': stylesState.fontSizeOption.value,
					'--font-color': stylesState.fontColor.value,
					'--container-width': stylesState.contentWidth.value,
					'--bg-color': stylesState.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm
				isOpen={isOpen}
				onToggle={() => setIsOpen((prev) => !prev)}
				initialValues={stylesState}
				onApply={handleApply}
				defaultSnapshot={defaultSnapshot.current}
			/>
			<Article />
		</main>
	);
};

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
