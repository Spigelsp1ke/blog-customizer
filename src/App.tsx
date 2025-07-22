import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';

import './styles/index.scss';
import styles from './styles/index.module.scss';

export const App = () => {
	return (
		<main className={styles.main}>
			<ArticleParamsForm />
			<Article />
		</main>
	);
};
