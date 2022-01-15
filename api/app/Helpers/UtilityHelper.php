<?php

namespace App\Helpers;

class UtilityHelper
{
    function validatonErrs($errArr, $onlyFirstErr = false)
    {
        $errs = array();
        $i=0;
        foreach ($errArr as $k => $r) {
            if($k=="email.$i"){
                $errs['email'][$i] = reset($r);
                ++$i;

            }else{
                $errs[$k] = reset($r);
            }
            
        }

        return ($onlyFirstErr) ? reset($errs) : $errs;
    }
    static function validationErrors($errArr, $onlyFirstErr = false){
        $errs = array();
        foreach ($errArr as $k => $r) {
            $errs[$k] = reset($r);
        }

        return ($onlyFirstErr) ? reset($errs) : $errs;
    }

    static function filterObj(&$obj,$data,$keys)
    {
        foreach($data as $k=>$v){
            if(in_array($k, $keys)){
                $obj->$k=$v;
            }
        }
        return $obj;
    }
}
