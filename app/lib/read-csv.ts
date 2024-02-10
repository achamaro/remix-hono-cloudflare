import { convert, detect, Encoding } from "encoding-japanese";
import { parse } from "papaparse";

/**
 * CSVファイルを読み込む
 * @param file - CSVファイルオブジェクト
 * @returns - CSVデータ配列
 */
export function readCsv<T extends Record<string, string>[]>(
  file: File
): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      // CSV文字列を読み込む
      // UTF-8に変換する
      const data = new Uint8Array(e?.target?.result as ArrayBuffer);
      const encoding = detect(data) as Encoding;
      const csvString = convert(data, {
        to: "UNICODE",
        from: encoding,
        type: "string",
      });

      parse(csvString, {
        // ヘッダー行をキーに使用する
        header: true,
        // 空行をスキップする
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results?.data as T);
        },
        error: () => {
          reject(new Error("CSVファイルの読み込みに失敗しました。"));
        },
      });
    };

    // ファイル読み込み
    reader.readAsArrayBuffer(file);
  });
}
