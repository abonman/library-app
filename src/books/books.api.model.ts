import { ConfigService } from '@nestjs/config';

const configService: ConfigService = new ConfigService()

const fields = {
    title: 'intitle:',
    author: 'inauthor:',
    publisher: 'inpublisher:',
    subject: 'subject:',
    isbn: 'isbn:'
};
interface Ifields {
    title?: string,
    author?: string,
    publisher?: string,
    subject?: string,
    isbn?: string
}
class BookApi {
    constructor() {
        this.url = configService.get("API_BASE_URL")
    }
    url: string

    setQuery(object: Ifields): void {
        const param = []
        Object.keys(fields).map((field) => { object[field] ? param.push(fields[field] + object[field]) : '' })
        this.url += "volumes?q=" + param.join('+') + "&printType=books&orderBy=newest"
    }
    setBookId(id: string): void {
        this.url += "volumes/" + id
    }
}

export { BookApi, Ifields }