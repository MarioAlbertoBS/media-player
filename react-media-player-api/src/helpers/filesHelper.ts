import fs from 'fs';

export async function openFile(filePath: string): Promise<string> {
    let content = "";
    try {
        content = await fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error("Could not open file: ", error);
        content = "";
    }
    return content;
}

export async function writeFile(filePath: string, content: string): Promise<boolean> {
    try {
        fs.writeFileSync(filePath, content, 'utf-8');
        return true;
    } catch (error) {
        console.error("Could not save the file: ", error);
    }
    return false;
}