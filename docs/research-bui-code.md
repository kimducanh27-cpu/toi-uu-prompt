# Research — ghi chú Bụi Code

Nguồn: 5 ghi chú học tập local (Khóa 1–5), đọc ngày 2026-10-30. Không republish nguyên văn.

## 1. Khung prompt 5 phần

Từ Khóa 2, bài “Giải phẫu prompt”:

1. **Mục tiêu** — muốn đạt gì.
2. **Bối cảnh** — ai đọc, tình huống, dữ kiện thật.
3. **Phạm vi** — làm gì, bỏ gì, không đụng gì.
4. **Ràng buộc** — độ dài, giọng, nguồn, dữ liệu, từ cấm.
5. **Nghiệm thu** — tiêu chí kiểm được: đếm, nhìn, bấm, so.

Chẩn đoán prompt hỏng: nhìn triệu chứng ở output rồi truy phần thiếu. Ví dụ:

| Triệu chứng | Phần thiếu | Sửa tối thiểu |
|---|---|---|
| Chung chung | Bối cảnh/người đọc | Thêm ai đọc, họ quyết định gì |
| Dài lan man | Ràng buộc + phạm vi | Giới hạn từ/số mục |
| Bịa số | Ràng buộc nguồn | Chỉ dùng dữ kiện được cấp; thiếu ghi `[THIẾU]` |
| Sai định dạng | Nghiệm thu/định dạng | Đưa mẫu output |
| Làm thừa | Phạm vi | “Chỉ làm X, không đụng Y” |

## 2. Few-shot

- 2–3 ví dụ “đầu vào → đầu ra” thường đủ.
- Mẫu phải đa dạng, cùng định dạng output, có 1 ca khó.
- Mẫu sai/na ná nhau sẽ kéo output sai.
- Việc logic/tính toán cần luật rõ + kiểm, không chỉ ví dụ.
- Không đưa dữ liệu thật/nhạy cảm vào ví dụ.

## 3. Hỏi trước khi làm

Mẫu:

```text
Trước khi làm, đừng viết kết quả ngay. Hãy:
1. Hỏi tôi tối đa 5 câu quan trọng nhất, chỉ câu làm thay đổi kết quả.
2. Nêu giả định nếu tôi không trả lời.
3. Chờ tôi trả lời rồi mới làm.
```

Dùng cho việc mơ hồ/nhiều bước/hậu quả cao. Việc đơn giản thì hỏi ít hoặc không hỏi.

## 4. Để AI tự viết prompt

Khi người dùng bí cách diễn đạt:

1. Đưa việc đích + ngữ cảnh thật.
2. Nhờ AI viết prompt chi tiết.
3. Sửa prompt bằng dữ kiện riêng.
4. Chỉ dùng sau khi kiểm output.

Giới hạn: AI viết prompt không biết dữ kiện nội bộ; không thay bước kiểm.

## 5. Sáu thành phần skill (từ Khóa 5)

1. Metadata/description — agent biết khi nào dùng.
2. Quy trình — các bước, quy tắc, mẫu trả lời.
3. Kiến thức — references, đọc theo nhu cầu.
4. Script/tool — việc cần chính xác thì để máy làm.
5. Assets — mẫu/checklist đầu ra.
6. Chất lượng & vòng đời — eval, test, changelog, maintain.

Bài học:

- Description là “bảng hiệu”: làm gì, khi nào dùng, không dùng cho việc gì.
- Tách quy trình khỏi kiến thức; progressive disclosure.
- Cổng chống bịa: nguồn sự thật, `[CẦN KIỂM CHỨNG]`, hỏi trước, từ chối ngoài phạm vi.
- Đừng để AI tự tính; đóng gói script + self-test.
- Skill tốt biết nói “không” và có ngày/version.

## 6. Bài học khác

- “AI báo xong” không phải bằng chứng; phải kiểm bằng output/artifact.
- Prompt cần acceptance kiểm được, không dùng tính từ cảm tính.
- Vibe coding vẫn cần plan, scope, test và người chịu trách nhiệm.
- Không đưa secret/PII vào prompt.

## 7. Áp dụng vào kit

- Intake tối đa 5 câu; nêu giả định.
- Rubric map 5 phần + output schema + safety + token.
- Template có few-shot và self-check.
- Eval tách cấu trúc khỏi chất lượng; live eval phải có model.
- Skill/command/hook/plugin dùng description rõ và quy trình tách references.
