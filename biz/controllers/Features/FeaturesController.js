export default class Features {
    constructor() {

    }
    uploadFiles(ctx) {
        let url = `http://101.201.70.134/upload/${ctx.request.files.file.path.split('/').pop()}`
        ctx.response.body = ctx.parsebody({url: url, name: ctx.request.files.file.name})
    }
}
