import { UserDocument } from '@/models/user.model'; 

declare module 'next/server' {
    interface NextRequest {
        user?: UserDocument;
    }
}
