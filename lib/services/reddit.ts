import { Platform } from 'react-native';

export interface RedditPost {
    id: string;
    user: string;
    time: string;
    avatar: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    url: string;
}

const FALLBACK_POSTS: RedditPost[] = [
    {
        id: 'fallback_1',
        user: 'OrganicFarmer',
        time: '2h ago',
        avatar: 'https://ui-avatars.com/api/?name=OrganicFarmer&background=random',
        content: 'Tips for managing aphids in tomato plants using neem oil. Works like a charm!',
        likes: 15,
        comments: 4,
        url: 'https://www.reddit.com/r/IndiaHomeStead/',
    },
    {
        id: 'fallback_2',
        user: 'HarvestMaker',
        time: '5h ago',
        avatar: 'https://ui-avatars.com/api/?name=HarvestMaker&background=random',
        content: 'Check out my vertical garden setup for strawberries. Perfect for small spaces.',
        image: 'https://images.unsplash.com/photo-1592394933222-74d957388bfc?q=80&w=2000',
        likes: 42,
        comments: 12,
        url: 'https://www.reddit.com/r/IndiaHomeStead/',
    }
];

function getRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp * 1000;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

export async function fetchRedditPosts(searchQuery?: string): Promise<RedditPost[]> {
    try {
        let url = 'https://www.reddit.com/r/IndiaHomeStead/new.json';

        if (searchQuery) {
            const cleanQuery = searchQuery.startsWith('#') ? searchQuery.substring(1) : searchQuery;
            url = `https://www.reddit.com/r/IndiaHomeStead/search.json?q=${encodeURIComponent(cleanQuery)}&restrict_sr=1&sort=new`;
        }

        // Only use proxy for Web to avoid CORS. Native apps don't need it.
        const finalUrl = Platform.OS === 'web'
            ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
            : url;

        console.log(`Fetching Reddit posts from: ${url}`);
        const response = await fetch(finalUrl);

        if (!response.ok) {
            console.warn(`Reddit fetch failed with status ${response.status}. Using fallback data.`);
            return FALLBACK_POSTS;
        }

        const json = await response.json();

        if (!json.data || !json.data.children || json.data.children.length === 0) {
            return FALLBACK_POSTS;
        }

        return json.data.children.map((child: any) => {
            const data = child.data;
            let image = undefined;

            if (data.post_hint === 'image' || data.url?.match(/\.(jpeg|jpg|gif|png)$/)) {
                image = data.url;
            } else if (data.thumbnail && data.thumbnail.startsWith('http')) {
                image = data.thumbnail;
            } else if (data.preview?.images?.[0]?.source?.url) {
                image = data.preview.images[0].source.url.replace(/&amp;/g, '&');
            }

            return {
                id: data.id,
                user: data.author,
                time: getRelativeTime(data.created_utc),
                avatar: `https://ui-avatars.com/api/?name=${data.author}&background=random`,
                content: data.title + (data.selftext ? `\n\n${data.selftext.substring(0, 200)}${data.selftext.length > 200 ? '...' : ''}` : ''),
                image: image,
                likes: data.ups,
                comments: data.num_comments,
                url: `https://www.reddit.com${data.permalink}`,
            };
        });
    } catch (error) {
        console.error('Error fetching Reddit posts:', error);
        return FALLBACK_POSTS;
    }
}
