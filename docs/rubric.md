# Rubric 100 điểm cho prompt

Dùng để audit và so sánh baseline với prompt tối ưu. Điểm là **chất lượng cấu trúc**, không phải điểm chất lượng output của model.

## 1. Bảng điểm

| # | Tiêu chí | Điểm | Pass khi |
|---|---|---|---|
| 1 | Mục tiêu & vai trò | 15 | Có 1 mục tiêu rõ; role phù hợp; không mâu thuẫn |
| 2 | Bối cảnh & người đọc | 15 | Ai dùng, tình huống, dữ kiện nền, điều đã biết |
| 3 | Phạm vi & non-goals | 10 | Làm gì, bỏ gì, không đụng gì |
| 4 | Ràng buộc & an toàn | 15 | Độ dài/nguồn/giọng; cấm bịa; injection/PII |
| 5 | Định dạng đầu ra | 15 | Schema/mẫu; field bắt buộc; ví dụ đúng |
| 6 | Ví dụ / few-shot | 10 | 2–3 mẫu đa dạng, cùng format, không PII |
| 7 | Nghiệm thu & self-check | 10 | Tiêu chí kiểm được; bước tự kiểm |
| 8 | Model fit & token | 5 | Đúng model; không nhồi; có budget |
| 9 | Bảo trì & version | 5 | Version/owner; thay đổi có changelog |

Tổng: **100**.

## 2. Cách chấm từng tiêu chí

Mỗi tiêu chí chấm 0–3:

- **0** — thiếu hoàn toàn hoặc sai.
- **1** — có dấu hiệu nhưng mơ hồ/không kiểm được.
- **2** — đủ dùng, còn thiếu nhỏ.
- **3** — rõ, kiểm được, không mâu thuẫn.

Điểm tiêu chí = `(mức / 3) × điểm tối đa`, làm tròn 0.5.

## 3. Cap & fail

- Thiếu **định dạng đầu ra**: tối đa 70 điểm.
- Có mâu thuẫn ràng buộc nghiêm trọng: tối đa 60.
- Có prompt injection/PII/secret: tối đa 40; coi là P0.
- Không có tiêu chí nghiệm thu: tối đa 80.
- Không có ví dụ khi task cần format/giọng: tối đa 85.
- Điểm <60: không dùng; 60–74: cần sửa; 75–89: dùng kèm lưu ý; 90+: sẵn sàng.

## 4. Severity cho finding

- **P0** — prompt có thể gây hại: secret/PII, injection, xóa/deploy ngoài quyền.
- **P1** — thiếu output schema/acceptance hoặc mâu thuẫn lớn khiến không dùng được.
- **P2** — thiếu context/scope/ví dụ; output không ổn định.
- **P3** — clarity/token/style; không đổi hành vi.

## 5. Cách đo

- Structure eval (`scripts/eval-prompts.mjs`) kiểm các mục bắt buộc, ví dụ, schema, self-check, safety.
- Live eval (optional) cần model/API; nếu không có, ghi `blocked`, không suy điểm.
- So sánh baseline/optimized cùng case, cùng rubric, cùng version.
- Lưu `evals/results/*.md` và JSON; không sửa test để pass.

## 6. Liên hệ 5 phần Bụi Code

| 5 phần | Tiêu chí rubric |
|---|---|
| Mục tiêu | 1 |
| Bối cảnh | 2 |
| Phạm vi | 3 |
| Ràng buộc | 4 |
| Nghiệm thu | 5 + 7 |
