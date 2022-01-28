import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Prismic from '@prismicio/client';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { RichText } from 'prismic-dom';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const contentText = post.data.content.reduce((acumulator, content) => {
    return acumulator + ' ' + RichText.asText(content.body);
  }, '');

  const words = contentText.trim().split(/\s+/).length;

  const read_time = Math.ceil(words / 200);

  if (router.isFallback) {
    return <div>Carregando...</div>
  }

  return (
    <>
      <Header />
      <img className={styles.banner} src={post.data.banner.url} alt={post.data.title}/>

      <div className={styles.body}>
        <h1>{post.data.title}</h1>

        <div className={styles.heading}>
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

          <FiUser /><span>{post.data.author}</span>
          <AiOutlineClockCircle /><span>{`${read_time} min`}</span>
        </div>

        {post.data.content.map(content => {
          return (
            <div key={content.heading} className={styles.content}>
              <h1>{content.heading}</h1>

              <div
                className={styles.postBody}
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body)}}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const { results } = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    pageSize: 1
  });

  const paths = results.map(result => {
    return {
      params: {
        slug: result.uid
      }
    }
  });

  return {
    paths: paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;

  const post = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post: post
    }
  }
};
