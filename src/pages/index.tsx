import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import Link from 'next/link';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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

export default function Home({ postsPagination }: HomeProps) {
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostPagination>(postsPagination);

  async function handleLoadPostsClick() {
    setIsLoadingMorePosts(true);

    const response = await fetch(posts.next_page);
    const data: PostPagination = await response.json();

    setPosts(prevData => {
      return {
        next_page: data.next_page,
        results: [...prevData.results, ...data.results]
      }
    });

    setIsLoadingMorePosts(false);
  }

  return (
    <main className={styles.container}>
      <header>
        <img src="/logo.svg" alt="logo" />
      </header>
      <section className={styles.postsContainer}>
        {posts.results.map(post => {
          return (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <div className={styles.post}>
                <h3>{post.data.title}</h3>
                <p>{post.data.subtitle}</p>

                <footer>
                  <div>
                    <AiOutlineCalendar />
                    <span>{
                      format(
                        new Date(post.first_publication_date),
                        "PP",
                        {
                          locale: ptBR,
                        }
                      )}
                    </span>
                  </div>
                  <div>
                    <FiUser /> <span>{post.data.author}</span>
                  </div>
                </footer>
              </div>
            </Link>
          );
        })}

        {posts.next_page && (
          <button
            onClick={handleLoadPostsClick}
            className={styles.loadMorePostsButton}
            disabled={isLoadingMorePosts}
          >
            Carregar mais posts
          </button>
        )}
      </section>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    pageSize: 1
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results
      }
    }
  }
};
