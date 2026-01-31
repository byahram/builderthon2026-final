require('dotenv').config();
const { getKnowledgeBaseChunks } = require('./services/local_rag');
const { rerankDocuments } = require('./services/nvidia');

async function benchmarkRag() {
    const query = "마케팅 돈 쓰기 아까운데(Free), 우리 동네 당근마켓(Local)에 홍보 글을 매일 올려보려고 해! 어떻게 글을 쓰는게 좋을까?";
    
    console.log(`\n🔎 [질문]: ${query}\n`);
    
    // 1. Get All Chunks (Baseline: No Vector Search, just all knowledge)
    const allChunks = getKnowledgeBaseChunks();
    console.log(`📚 전체 지식 청크 수: ${allChunks.length}개`);

    try {
        // 2. Rerank with NVIDIA
        console.log("🚀 NVIDIA Rerank 실행 중...");
        const rankings = await rerankDocuments(query, allChunks);
        
        // 3. Analysis
        const top3 = rankings.slice(0, 3);
        const bottom3 = rankings.slice(-3);

        console.log("\n✅ [NVIDIA Rerank 결과: 상위 3개 (선택됨)]");
        top3.forEach((r, i) => {
            const doc = allChunks[r.index];
            console.log(`${i+1}. 점수: ${r.logit.toFixed(4)} | 제목: ${doc.metadata.title}`);
            console.log(`   내용 요약: ${doc.text.substring(0, 100).replace(/\n/g, ' ')}...`);
        });

        console.log("\n❌ [NVIDIA Rerank 결과: 하위 3개 (필터링됨)]");
        bottom3.forEach((r, i) => {
            const doc = allChunks[r.index];
            console.log(`${i+1}. 점수: ${r.logit.toFixed(4)} | 제목: ${doc.metadata.title}`);
            console.log(`   내용 요약: ${doc.text.substring(0, 100).replace(/\n/g, ' ')}...`);
        });

        console.log("\n📊 [PPT용 비교 요약]");
        console.log("RAG를 사용하지 않거나 단순 검색을 하면, 하위 3개와 같은 관련 없는 문서가 포함될 수 있습니다.");
        console.log("NVIDIA Rerank를 사용하면, 높은 점수의 문서만 선별하여 AI에게 전달합니다.");
        console.log(`1등 문서(${top3[0].logit.toFixed(2)})와 꼴등 문서(${bottom3[2].logit.toFixed(2)})의 점수 차이가 모델의 변별력을 보여줍니다.`);

    } catch (error) {
        console.error("벤치마크 실행 실패:", error);
    }
}

benchmarkRag();
