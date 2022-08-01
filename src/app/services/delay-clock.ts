export class DelayClock {

    public static delay(ms: number, arg:any) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}
