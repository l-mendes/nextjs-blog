import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState<boolean>(false);

  async function handleLoadPostsClick() {
    setIsLoadingMorePosts(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoadingMorePosts(false);
  }

  return (
    <main className={styles.container}>
      <header>
        <img src="/logo.svg" alt="logo" />
      </header>
      <section className={styles.postsContainer}>
        <div className={styles.post}>
          <h3>Como utilizar Hooks</h3>
          <p>Pensando em sincronização em vez de ciclos.</p>

          <footer>
            <div>
              <AiOutlineCalendar /> <span>15 Mar 2021</span>
            </div>
            <div>
              <FiUser /> <span>Joseph Oliveira</span>
            </div>
          </footer>
        </div>

        <div className={styles.post}>
          <h3>Como utilizar Hooks</h3>
          <p>Pensando em sincronização em vez de ciclos.</p>

          <footer>
            <div>
              <AiOutlineCalendar /> <span>15 Mar 2021</span>
            </div>
            <div>
              <FiUser /> <span>Joseph Oliveira</span>
            </div>
          </footer>
        </div>

        <div className={styles.post}>
          <h3>Como utilizar Hooks</h3>
          <p>Pensando em sincronização em vez de ciclos.</p>

          <footer>
            <div>
              <AiOutlineCalendar /> <span>15 Mar 2021</span>
            </div>
            <div>
              <FiUser /> <span>Joseph Oliveira</span>
            </div>
          </footer>
        </div>

        <button
          onClick={handleLoadPostsClick}
          className={styles.loadMorePostsButton}
          disabled={isLoadingMorePosts}
        >
          Carregar mais posts
          </button>
      </section>
    </main>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
