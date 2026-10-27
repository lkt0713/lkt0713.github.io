# 李冠廷 — 研究作品集

國立臺灣師範大學 地球科學系　|　大氣科學 × 資料分析

🔗 **https://lkt0713.github.io**

---

## 專案

| 專案 | 說明 |
|---|---|
| [西北太平洋熱帶氣旋路徑預測](https://lkt0713.github.io/Typhoon-Forecast/) | DeepMind WeatherNext、ECMWF 與 NOAA 共九個系集模式，與 JTWC、日本氣象廳、中央氣象署官方預報並列；含衛星雲圖動畫、侵襲機率、海洋熱含量、AIFS 垂直風切與駛流場、預報校驗與颱風歷史存檔，每 10 分鐘自動更新（另一個 repo） |
| 2023–2025 颱風路徑與誤差分析 | FNV3 / JMA / CWA 三家模式的路徑誤差驗證，50+ 個案 |
| 莫拉克 850hPa 帶通濾波比對 | ERA5 資料，10–30 天 vs 30–90 天季內振盪訊號逐日比對 |
| Bandpass 動畫檢視器 | 滾輪／拖曳刷時間軸的濾波動畫播放器 |
| 莫拉克 q3max vs 雷達回波 | 模式診斷量與中央氣象署雷達觀測逐時對照 |
| 臺灣大專校院休學分析 | 全國校務資料分析 + 機器學習特徵重要性比較 |
| 2026 第四屆小地盃 | 羽球賽事網站：賽程表、分組圖、場地配置 |
| 小地盃即時計分系統 | 比賽當天使用的計分／計時控台，含投影模式 |

## 技術

Python · ERA5 · Xarray · Matplotlib · Plotly · scikit-learn

## 結構

```
index.html          封面（關於我 / 專案 / 聯絡）
assets/             共用主題 CSS、JS、照片
projects/           各專案頁面與資料
```

各專案頁面共用 `assets/theme.css` 的設計 token 與 `assets/site.js`
（深淺色切換會跨頁記憶，使用 localStorage 的 `theme` 鍵；封面 `index.html` 以
`data-theme-lock="dark"` 固定深色，不受也不影響這個設定）。

> Plotly 圖表頁原本各自內嵌一份 plotly.js，已改為每個專案共用一份
> `plotly.min.js`，倉庫體積因此從 1.1GB 降到約 300MB。

## 設計出處

版面風格（黑底、Oswald 大寫標題、描邊跑馬燈、hover 反白、粒子變形背景）參考
[USTA Agency — usta.agency](https://usta.agency/)。

## 聯絡

- Instagram [@lkt_0713](https://www.instagram.com/lkt_0713/)
- GitHub [@lkt0713](https://github.com/lkt0713)
