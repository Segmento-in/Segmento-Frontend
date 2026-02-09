import { redirect } from 'next/navigation';

export default function ArticlesRedirect() {
    // Redirect /pulse/articles to default /pulse/articles/medium
    redirect('/pulse/articles/medium');
}
