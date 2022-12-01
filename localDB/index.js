const fsp = require('node:fs/promises');
const fs = require('node:fs');

class LocalDB {
  constructor(fileUrl) {
    this.fileUrl = fileUrl;
    this.content = {};
  }

  get data() {
    return this.content;
  }

  async init() {
    const readableStream = fs.createReadStream(this.fileUrl);

    let tempData = '';

    for await (const chunk of readableStream) {
      tempData += chunk;
    }

    this.content = JSON.parse(tempData);
  }

  async save() {
    await fsp.writeFile(this.fileUrl, JSON.stringify(this.content, null, 4));
  }

  async addQuestion(question) {
    this.content.questions.push(question);

    await this.save();
  }

  async editQuestion(index, question) {
    this.content.questions[index] = question;

    await this.save();
  }

  async write(key, value) {
    this.content[key] = value;

    await this.save();
  }
}

module.exports = LocalDB;