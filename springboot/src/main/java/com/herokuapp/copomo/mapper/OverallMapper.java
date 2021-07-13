package com.herokuapp.copomo.mapper;

import com.herokuapp.copomo.model.Overall;

import org.apache.ibatis.annotations.Mapper;

/**
 * overallテーブルに関するマッパーインターフェースです。
 */
@Mapper
public interface OverallMapper {
    /**
     * overallテーブルのデータを全件取得します。
     * 
     * @return overallテーブルのデータの一覧
     */
    public Overall findAll();

    /**
     * overallテーブルを更新します。
     * 
     * @return 成功した場合はtrue
     */
    public boolean update(Overall overall);
}
