import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    role: string;
    [key: string]: unknown;
}

type GetServerSideProps<P = Record<string, unknown>> = (
    context: GetServerSidePropsContext
) => Promise<GetServerSidePropsResult<P>>;

export function withAuth<P = Record<string, unknown>>(
    getServerSidePropsFunc: GetServerSideProps<P>
): GetServerSideProps<P> {
    return async (context: GetServerSidePropsContext) => {
        const { req } = context;
        const token = req.cookies.token;

        if (!token) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        function verifyToken(token: string): DecodedToken | null {
            try {
                return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
            } catch (error) {
                return null;
            }
        }

        const decodedToken = verifyToken(token);

        if (!decodedToken) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        if (decodedToken.role !== 'admin') {
            return {
                notFound: true,
            };
        }

        return await getServerSidePropsFunc(context);
    };
}