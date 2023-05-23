# 为 atcoder-for-chinese 准备的爬虫

最近一次抓取：2023-5-23 ABC302 ARC160 AGC062

## 数据来源

来源于 [Atcoder Problems](https://github.com/kenkoooo/AtCoderProblems)，爬取的文件：

- https://kenkoooo.com/atcoder/resources/contests.json
- https://kenkoooo.com/atcoder/resources/problems.json
- https://kenkoooo.com/atcoder/resources/problem-models.json
- https://kenkoooo.com/atcoder/resources/contest-problem.json

## 使用方法

clone 或下载到本地，安装 Node.js 和 npm，执行 `npm install`（如果太慢可以换个源），然后执行 `npm start`，如果无异常会输出 `done`，然后在当前目录下会出现一个 `data.json` 文件。

## 输出格式

以下是某时刻输出的一部分，仅供参考：

```json
{
  "abc": [
    {
      "id": "abc001",
      "start_epoch_second": 1381579200,
      "duration_second": 7200,
      "title": "AtCoder Beginner Contest 001",
      "rate_change": "-",
      "problems": [/*...*/]
    },
    //...
  ],
  "arc": [
    {
      "id": "arc001",
      "start_epoch_second": 1334404800,
      "duration_second": 18000,
      "title": "AtCoder Regular Contest 001",
      "rate_change": "-",
      "problems": [/*...*/]
    },
    //...
  ],
  "agc": [
    {
      "id": "agc001",
      "start_epoch_second": 1468670400,
      "duration_second": 6600,
      "title": "AtCoder Grand Contest 001",
      "rate_change": "All",
      "problems": [/*...*/]
    },
    //...
  ],
  "ahc": [
    {
      "id": "ahc001",
      "start_epoch_second": 1614999600,
      "duration_second": 720000,
      "title": "AtCoder Heuristic Contest 001",
      "rate_change": "-",
      "problems": [/*...*/]
    },
    //...
  ],
  "others": [
    {
      "id": "APG4b",
      "start_epoch_second": 0,
      "duration_second": 3153600000,
      "title": "C++入門 AtCoder Programming Guide for beginners (APG4b)",
      "rate_change": "-",
      "problems": [/*...*/]
    },
    //...
  ]
}
```

以下是比赛 `abc001` 的数据的一部分：

```json
{
  "id": "abc001",
  "start_epoch_second": 1381579200,
  "duration_second": 7200,
  "title": "AtCoder Beginner Contest 001",
  "rate_change": "-",
  "problems": [
    {
      "id": "abc001_1",
      "contest_id": "abc001",
      "problem_index": "A",
      "name": "積雪深差",
      "title": "A. 積雪深差",
      "difficulty": -305
    },
    //...
  ]
}
```
