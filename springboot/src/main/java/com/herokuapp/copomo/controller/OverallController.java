package com.herokuapp.copomo.controller;

import com.herokuapp.copomo.model.Overall;
import com.herokuapp.copomo.service.OverallService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 全体の統計に関するリクエストを受け取り、結果を返すコントローラーです。
 */
@RestController
@RequestMapping("/api/overall")
public class OverallController {

    private final OverallService overallService;

    public OverallController(OverallService overallService) {
        this.overallService = overallService;
    }

    /**
     * overallテーブルのデータを全件取得します。
     * 
     * @return overallテーブルのデータの一覧
     */
    @GetMapping("/findall")
    public Overall findAll() {
        return overallService.findall();
    }

    /**
     * ポモドーロのカウントを増やします。
     * 
     * @return 成功した場合はtrue
     */
    @PostMapping("/incpomodorocount")
    public boolean incPomodoroCount() {
        return overallService.incPomodoroCount();
    }
}
